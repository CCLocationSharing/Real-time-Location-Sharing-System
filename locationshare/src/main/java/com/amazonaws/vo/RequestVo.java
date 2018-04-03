package com.amazonaws.vo

import com.amazonaws.constants.RequestType
import java.io.Serializable;
import java.util.Date;

@SuppressWarnings("serial")
public class RequestVo implements Serializable {

	private int userId;
	private int tabId;
	private RequestType type;
	private long startTime;
	private long endTime;
	private long currTime;

	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getUserId() {
		return userId;
	}

	public void setTabId(int tabId) {
		this.tabId = tabId;
	}
	public int getTabId() {
		return tabId;
	}

	public void setType(RequestType type) {
		this.type = type;
	}
	public RequestType getType() {
		return type;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}
	public long getStartTime() {
		return startTime;
	}

	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}
	public long getEndTime() {
		return endTime;
	}

	public void setCurrTime(long currTime) {
		this.currTime = currTime;
	}
	public long getCurrTime() {
		return currTime;
	}

	public static RequestVo from(ReservationItem requestItem) {
		if(requestItem == null) return null;

		RequestVo vo = new RequestVo();
		vo.setUserId(requestItem.getUserId());
		vo.setTabId(requestItem.getTabId());
		vo.setType(requestItem.getType());
		vo.setStartTime(requestItem.getStartTime());
		vo.setEndTime(requestItem.getEndTime());
		vo.setCurrTime(requestItem.getCurrTime());

		return vo;
	}
}