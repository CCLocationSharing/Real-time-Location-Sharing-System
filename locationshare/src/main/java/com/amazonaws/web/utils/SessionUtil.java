package com.amazonaws.web.utils;

import javax.servlet.http.HttpSession;
import com.amazonaws.constants.DeviceType;
import com.amazonaws.constants.SessionConstants;
import com.amazonaws.vo.SignInUserVo;

import org.springframework.stereotype.Component;


@Component
public class SessionUtil {
	
	public String getLastVisitedUrl(HttpSession session){
		String lastVisitedUrl = (String) session
				.getAttribute(SessionConstants.SESSION_LAST_VISITED_URL);
		return lastVisitedUrl != null ? lastVisitedUrl : "/";
	}
	
	public SignInUserVo getSignInUser(HttpSession session){
		return (SignInUserVo)session.getAttribute(
				SessionConstants.SESSION_SIGNIN_USER);
	}
	
	public DeviceType getBy(HttpSession session){
		return (DeviceType) session.getAttribute(
				SessionConstants.SESSION_BY);
	}
	
}
