package com.amazonaws.web.controller;

import javax.servlet.http.HttpServletRequests;
import javax.servlet.http.HttpSession;

import com.amazonaws.vo.UserVo;
import com.amazonaws.web.utils.SessionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ReservationController {

	@Autowired
	SessionUtil sessionUtil;

	@RequestMapping(value="/reserve", method=RequestMethod.GET)
	public String get(Model model, 
			HttpServletRequests request, HttpSession session) {
		
		UserVo user = sessionUtil.getSignInUser(session);
		if(user == null) {
			return "redirect:/signin";
		}

		model.addAttribute("user", user);
		return "new-reservation";
	}

	@RequestMapping(value="/reserve", method=RequestMethod.POST)
	public String post(Model model, 
			HttpServletRequests request, HttpSession session) {
		
		return get(model, request, session);
	}
}