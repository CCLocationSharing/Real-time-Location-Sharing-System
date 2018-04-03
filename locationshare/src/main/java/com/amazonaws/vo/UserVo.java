package com.amazonaws.vo

import com.amazonaws.entities.UserItem;
import java.io.Serializable;

@SuppressWarnings("serial")
public class UserVo implements Serializable {

	private int userId;
	private String userName;

	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getUserId() {
		return userId;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserName() {
		return userName;
	}

	public static UserVo from(UserItem userItem){
		if(userItem == null) return null;

		UserVo vo = new UserVo();
		vo.setUserId(userItem.getUserId());
		vo.setUserName(userItem.getUserName());

		return vo;
	}
}