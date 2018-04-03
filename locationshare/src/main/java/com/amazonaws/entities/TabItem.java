package com.amazonaws.entities

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import org.hibernate.validator.constraints.NotEmpty;

@DynamoDBTable(tabelName = "TAB")
public class TabItem {

	@NotEmpty
	private int tabId;
	@NotEmpty
	private int size;
	@NotEmpty
	private int libId;

	@DynamoDBHashKey(attributeName = "tabId")
	public int getTabId() {
		return tabId;
	}
	public void setTabId(int tabId) {
		this.tabId = tabId;
	}

	@DynamoDBAttribute(attributeName = "size")
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}

	@DynamoDBAttribute(attributeName = "libId")
	public int getLibId() {
		return libId;
	}
	public void setLibId(int libId) {
		this.libId = libId;
	}
	
}