package com.amazonaws.entities

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.NotBlank;

@DynamoDBTable(tabelName = "LIB")
public class LibItem {

	@NotEmpty
	private int libId;
	@NotBlank
	private String libName;

	@DynamoDBHashKey(attributeName = "libId")
	public int getLibId() {
		return libId;
	}
	public void setLibId(int libId) {
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