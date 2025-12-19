package com.github.dolphin;

import javax.faces.FacesException;
import javax.faces.application.ViewExpiredException;
import javax.faces.context.ExceptionHandler;
import javax.faces.context.ExceptionHandlerWrapper;
import javax.faces.context.FacesContext;
import javax.faces.event.ExceptionQueuedEvent;
import javax.faces.event.ExceptionQueuedEventContext;
import java.util.Iterator;

public class ViewExpiredExceptionHandler extends ExceptionHandlerWrapper {

    private ExceptionHandler wrapped;

    public ViewExpiredExceptionHandler(ExceptionHandler wrapped) {
        this.wrapped = wrapped;
    }

    @Override
    public ExceptionHandler getWrapped() {
        return wrapped;
    }

    @Override
    public void handle() throws FacesException {
        FacesContext facesContext = FacesContext.getCurrentInstance();
        
        Iterator<ExceptionQueuedEvent> iterator = getUnhandledExceptionQueuedEvents().iterator();
        
        while (iterator.hasNext()) {
            ExceptionQueuedEvent event = iterator.next();
            ExceptionQueuedEventContext context = (ExceptionQueuedEventContext) event.getSource();
            Throwable throwable = context.getException();

            if (throwable instanceof ViewExpiredException) {
                ViewExpiredException vee = (ViewExpiredException) throwable;
                
                try {
                    String viewId = vee.getViewId();
                    
                    if (viewId == null || viewId.isEmpty()) {
                        viewId = "/main.xhtml";
                    }
                    System.out.println("ViewExpiredException caught: " + viewId + " - Redirecting...");
                    iterator.remove();
                    facesContext.getExternalContext().redirect(
                        facesContext.getExternalContext().getRequestContextPath() + viewId
                    );
                    facesContext.responseComplete();
                } catch (Exception e) {
                    throw new FacesException(e);
                }
            }
        }
        getWrapped().handle();
    }
}

