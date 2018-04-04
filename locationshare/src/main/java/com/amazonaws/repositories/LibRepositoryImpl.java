package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.LibItem;
import com.amazonaws.repositories.LibRepository;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

public class LibRepositoryImpl implements LibRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public LibRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	LibItem findByLibId(String libId) {
		LibItem libItem = mapper.load(LibItem.class, libId);
		if(libItem != null) {
			return libItem;
		}else {
			System.out.println("ERR: NO MATCHED ROW");
			return null;
		}
	}

	List<LibItem> findAllByLibId(List<String> libIds) {
		List<LibItem> libItems= new ArrayList<>();
		for(String libId: libIds) {
			LibItem libItem = new LibItem();
			libItem.setLibId(libId);
			libItems.add(libItem)
		}
		Map<String, List<LibItem>> items = mapper.batchLoad(libItems);
		if(items != null) {
			return items.get("LIB");
		}else {
			System.out.println("ERR: NO MATCHED ROWS");
			return null;
		}
	}

} 