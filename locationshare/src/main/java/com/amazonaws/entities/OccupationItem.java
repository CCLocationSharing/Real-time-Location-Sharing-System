package com.amazonaws.entities;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotBlank;

@DynamoDBTable(tableName = "Occupation")
public class OccupationItem {

	@NotBlank
	private String tabId;
	@NotNull
	private long startTime;
	@NotNull
	private boolean isExipred;

	private long endTime;
	@NotBlank
	private String userId;
	private long producedTime;


	@DynamoDBHashKey(attributeName = "tabId")
	public String getTabId() {
		return tabId;
	}
	public void setTabId(String tabId) {
		this.tabId = tabId;
	}

	@DynamoDBRangeKey(attributeName = "startTime")
	public long getStartTime() {
		return startTime;
	}
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	@DynamoDBAttribute(attributeName = "isExipred")
	public boolean getIsExipred() {
		return isExipred;
	}
	public void setIsExpired(boolean isExipred) {
		this.isExipred = isExipred;
	}

	@DynamoDBAttribute(attributeName = "endTime")
	public long getEndTime() {
		return endTime;
	}
	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	@DynamoDBAttribute(attributeName = "userId")
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}

	@DynamoDBAttribute(attributeName = "producedTime")
	public long getProducedTime() {
		return producedTime;
	}
	public void setProducedTime(long producedTime) {
		this.producedTime = producedTime;
	}

}