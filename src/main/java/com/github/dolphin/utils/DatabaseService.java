package com.github.dolphin.utils;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Named("databaseService")
@ApplicationScoped
public class DatabaseService {

    private static final String DB_URL = "jdbc:derby:pointsDB;create=true";
    private Connection connection;

    @PostConstruct
    public void init() {
        try {
            System.out.println("[DB] Loading Derby driver...");
            Class.forName("org.apache.derby.jdbc.EmbeddedDriver");
            System.out.println("[DB] Connecting to database: " + DB_URL);
            connection = DriverManager.getConnection(DB_URL);
            System.out.println("[DB] Connection established!");
            createTableIfNotExists();
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("[DB] ERROR: " + e.getMessage());
            throw new RuntimeException("Database initialization error", e);
        }
    }

    private void createTableIfNotExists() throws SQLException {
        DatabaseMetaData meta = connection.getMetaData();
        ResultSet tables = meta.getTables(null, null, "POINTS", null);
        
        if (!tables.next()) {
            System.out.println("[DB] Table POINTS not found, creating...");
            String createTableSQL = """
                CREATE TABLE POINTS (
                    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
                    x FLOAT NOT NULL,
                    y FLOAT NOT NULL,
                    r FLOAT NOT NULL,
                    isHit BOOLEAN NOT NULL,
                    createdAt TIMESTAMP NOT NULL,
                    executionTime BIGINT NOT NULL,
                    PRIMARY KEY (id)
                )
            """;
            try (Statement stmt = connection.createStatement()) {
                stmt.executeUpdate(createTableSQL);
            }
            System.out.println("[DB] Table POINTS created successfully!");
        } else {
            System.out.println("[DB] Table POINTS already exists");
        }
    }

    public void addPoint(Point point) {
        String sql = "INSERT INTO POINTS (x, y, r, isHit, createdAt, executionTime) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setFloat(1, point.getX());
            pstmt.setFloat(2, point.getY());
            pstmt.setFloat(3, point.getR());
            pstmt.setBoolean(4, point.getIsHit());
            pstmt.setTimestamp(5, new Timestamp(point.getCreatedAt().getTime()));
            pstmt.setLong(6, point.getExecutionTime());
            pstmt.executeUpdate();
            
            ResultSet generatedKeys = pstmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                point.setId(generatedKeys.getLong(1));
            }
            System.out.println("[DB] INSERT: point added (id=" + point.getId() + ", x=" + point.getX() + ", y=" + point.getY() + ", r=" + point.getR() + ", hit=" + point.getIsHit() + ")");
        } catch (SQLException e) {
            System.out.println("[DB] ERROR INSERT: " + e.getMessage());
            throw new RuntimeException("Error adding point to DB", e);
        }
    }

    public List<Point> getAllPoints() {
        List<Point> points = new ArrayList<>();
        String sql = "SELECT * FROM POINTS ORDER BY id";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Point point = new Point();
                point.setId(rs.getLong("id"));
                point.setX(rs.getFloat("x"));
                point.setY(rs.getFloat("y"));
                point.setR(rs.getFloat("r"));
                point.setIsHit(rs.getBoolean("isHit"));
                point.setCreatedAt(rs.getTimestamp("createdAt"));
                point.setExecutionTime(rs.getLong("executionTime"));
                points.add(point);
            }
            System.out.println("[DB] SELECT: loaded " + points.size() + " points from DB");
        } catch (SQLException e) {
            System.out.println("[DB] ERROR SELECT: " + e.getMessage());
            throw new RuntimeException("Error getting points from DB", e);
        }
        return points;
    }

    public void updateAllPoints(float newRadius) {
        String updateSql = "UPDATE POINTS SET r = ?, isHit = ? WHERE id = ?";
        try {
            List<Point> points = getAllPoints();
            System.out.println("[DB] UPDATE: updating " + points.size() + " points with new radius r=" + newRadius);
            for (Point point : points) {
                boolean newIsHit = Checker.isHit(point.getX(), point.getY(), newRadius);
                try (PreparedStatement pstmt = connection.prepareStatement(updateSql)) {
                    pstmt.setFloat(1, newRadius);
                    pstmt.setBoolean(2, newIsHit);
                    pstmt.setLong(3, point.getId());
                    pstmt.executeUpdate();
                }
            }
            System.out.println("[DB] UPDATE: all points updated successfully");
        } catch (SQLException e) {
            System.out.println("[DB] ERROR UPDATE: " + e.getMessage());
            throw new RuntimeException("Error updating points in DB", e);
        }
    }

    public void removeAllPoints() {
        String sql = "DELETE FROM POINTS";
        try (Statement stmt = connection.createStatement()) {
            int deleted = stmt.executeUpdate(sql);
            System.out.println("[DB] DELETE: removed " + deleted + " points from DB");
        } catch (SQLException e) {
            System.out.println("[DB] ERROR DELETE: " + e.getMessage());
            throw new RuntimeException("Error deleting points from DB", e);
        }
    }

    @PreDestroy
    public void cleanup() {
        try {
            System.out.println("[DB] Closing database connection...");
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
            // Proper Derby shutdown
            try {
                DriverManager.getConnection("jdbc:derby:;shutdown=true");
            } catch (SQLException e) {
                // Derby throws exception on shutdown - this is normal
            }
            System.out.println("[DB] Connection closed, Derby stopped");
        } catch (SQLException e) {
            System.out.println("[DB] ERROR on close: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
