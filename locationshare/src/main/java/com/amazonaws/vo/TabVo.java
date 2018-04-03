package com.amazonaws.vo

import com.amazonaws.entities.TabItem;
import java.io.Serializable;

@SuppressWarnings("serial")
public class TabVo implements Serializable {

	private int tabId;
	private int size;
	private int libId;

	public void setTabId(int tabId) {
		this.tabId = tabId;
	}
	public int getTabId() {
		return userId;
	}

	public void setSize(int size) {
		this.size = size;
	}
	public int getSize() {
		return size;
	}

	public void setLibId(int libId) {
		this.libId = libId;
	}
	public int getLibId() {
		return libId;
	}
	
	public static TabVo from(TabItem tabItem) {
		if(tabItem == null) return null;

		TabVo vo = new TabVo();
		vo.setTabId(tabItem.getTabId());
		vo.setSize(tabItem.getSize());
		vo.setLibId(tabItem.getLibId());

		return vo;
	}
}