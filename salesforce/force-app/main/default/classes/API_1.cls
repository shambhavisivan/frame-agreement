global with sharing class API_1 {
	global static Map <String, Object> getDelta(Id fa1, Id fa2) {
		return FAMDelta.getDelta(fa1, fa2);
	}
}