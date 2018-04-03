package com.amazonaws.web.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.amazonaws.constants.ApplicationConfig;

public class ContextPathListener implements ServletContextListener {

	public void contextInitialized(ServletContextEvent sce) {
		ServletContext sc = sce.getServletContext();
        sc.setAttribute("base", getContextPath(sc)); 
        ApplicationConfig.base = getContextPath(sc);
	}

	public void contextDestroyed(ServletContextEvent sce) {
		ServletContext sc = sce.getServletContext();
        sc.removeAttribute("base");
        ApplicationConfig.base = null;
	}

	private String getContextPath(ServletContext sc) {
		return sc.getContextPath();
	}
}