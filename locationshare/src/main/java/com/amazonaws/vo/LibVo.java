package com.amazonaws.vo

import com.amazonaws.entities.LibItem;
import java.io.Serializable;

@SuppressWarnings("serial")
public class LibVo implements Serializable {

	private int libId;
	private String libName;

	public void setLibId(int libId) {
		this.libId = libId;
	}
	public int getLibId() {
		return libId;
	}

	public void setLibName(String libName) {
		this.libName = libName;
	}
	public String getLibName() {
		return libName;
	}

	public static LibVo from(LibItem libItem) {
		if(libItem == null) return null;

		LibVo vo = new LibVo();
		vo.setLibId(libItem.getLibId());
		vo.setLibName(libItem.getLibName());

		return vo;
	}
}