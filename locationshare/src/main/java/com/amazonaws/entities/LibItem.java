package com.amazonaws.entities;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import org.hibernate.validator.constraints.NotBlank;

@DynamoDBTable(tableName = "LIB")
public class LibItem {

	@NotBlank
	private String libId;
	@NotBlank
	private String libName;

	@DynamoDBHashKey(attributeName = "libId")
	public String getLibId() {
		return libId;
	}
	public void setLibId(String libId) {
		this.libId = libId;
	}

	@DynamoDBAttribute(attributeName = "libName")
	public String getLibName() {
		return libName;
	}
	public void setLibName(String libName) {
		this.libName = libName;
	}

}