package com.amazonaws.entities

import com.amazonaws.constants.RequestType
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import javax.validation.constraints.NotNull;

@DynamoDBTable(tabelName = "RESERVATION") 
public class RequestItem {

	@NotNull
	private int tabId;
	@NotNull
	private int userId;
	@NotNull
	private RequestType type;
	@NotNull
	private long startTime;
	private long endTime;
	@NotNull
	private long currTime;

	@DynamoDBHashKey(attributeName = "tabId")
	public int getTabId() {
		return tabId;
	}
	public void setTabId(int tabId) {
		this.tabId = tabId;
	}

	@DynamoDBAttribute(attributeName = "userId")
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}

	@DynamoDBAttribute(attributeName = "type")
	public RequestType getType() {
		return type;
	}
	public void setType(RequestType type) {
		this.type = type;
	}

	@DynamoDBAttribute(attributeName = "startTime")
	public long getStartTime() {
		return startTime;
	}
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	@DynamoDBAttribute(attributeName = "endTime")
	public long getEndTime() {
		return endTime;
	}
	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	@DynamoDBAttribute(attributeName = "currTime")
	public long getCurrTime() {
		return currTime;
	}
	public void setCurrTime(long currTime) {
		this.currTime = currTime;
	}
	
}