package com.amazonaws.constants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public interface TimeConstants {
	static final List<Integer> PERIODS = new ArrayList<>(
		Arrays.asList(8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22));
	static final int OPENTIME = 8;
	static final int CLOSETIME = 22;
}
