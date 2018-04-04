package com.amazonaws.repositories;

public class LibRepositoryImpl implements LibRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public LibRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	LibItem findByLibId(String libId) {
		LibItem libitem = mapper.load(LibItem.class, libId);
		if(libitem != null) {
			return libitem;
		}else {
			System.out.println("ERR: NO MATCHED ROW");
			return null;
		}
	}

	LibItem findByLibName(String libName) {
		
	}

	List<LibItem> findAllByLibId(List<String> libIds); 

	List<LibItem> findAllByLibName(List<String> libNames);

	List<LibItem> findAll(); 

} 