package com.amazonaws.entities;

import com.amazonaws.constants.RequestType
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

@DynamoDBTable(tabelName = "RESERVATION") 
public class ReservationItem {

	private String id;
	@NotBlank
	private String tabId;
	@NotBlank
	private String userId;
	@NotNull
	private long startTime;
	@NotNull
	private long endTime;
	@NotNull
	private long currTime;

	@DynamoDBHashKey(attributeName = "Id")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	@DynamoDBAttribute(attributeName = "tabId")
	public String getTabId() {
		return tabId;
	}
	public void setTabId(String tabId) {
		this.tabId = tabId;
	}

	@DynamoDBAttribute(attributeName = "userId")
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
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