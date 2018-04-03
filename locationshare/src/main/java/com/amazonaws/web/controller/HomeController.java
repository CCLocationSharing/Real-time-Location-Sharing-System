package com.amazonaws.web.controller;

import java.util.ArrayList;
import java.util.Collection;
import javax.servlet.http.HttpServletRequests;
import javax.servlet.http.HttpSession;

import com.amazonaws.web.utils.SessionUtil;
import com.amazonaws.vo.FilterElementVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.util.StringUtils;

@Controller
public class HomeController {

	@Autowired
	SessionUtil sessionUtil;

	@RequestMapping(value="/", method=RequestMethod.GET)
	public String get(Model model, 
			HttpServletRequests request, HttpSession session) {
	}
}