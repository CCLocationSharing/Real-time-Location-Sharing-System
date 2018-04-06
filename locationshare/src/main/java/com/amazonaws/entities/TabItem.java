package com.amazonaws.entities;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import org.hibernate.validator.constraints.NotBlank;

@DynamoDBTable(tableName = "TAB")
public class TabItem {

	@NotBlank
	private String libId;
	@NotBlank
	private String tabId;
	private int size;

	@DynamoDBHashKey(attributeName = "libId")
	public String getLibId() {
		return libId;
	}
	public void setLibId(String libId) {
		this.libId = libId;
	}

	@DynamoDBRangeKey(attributeName = "tabId")
	public String getTabId() {
		return tabId;
	}
	public void setTabId(String tabId) {
		this.tabId = tabId;
	}

	@DynamoDBAttribute(attributeName = "size")
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	
}