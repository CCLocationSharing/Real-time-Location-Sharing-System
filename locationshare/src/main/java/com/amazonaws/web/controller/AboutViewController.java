package com.amazonaws.web.controller;

import javax.servlet.http.HttpServletRequests;

import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/about")
public class AboutViewController {

	public ModelAndView getAbout(HttpServletRequest request) {
		ModelAndView mv = new ModelAndView("about");
		return mv;
	}
}