package com.amazonaws.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class AboutViewController {

	@RequestMapping(value = "/about", method=RequestMethod.GET)
	public String getAboutView(HttpServletRequest request) throws Exception {
		return "about";
	}
}