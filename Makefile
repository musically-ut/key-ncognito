all:
	git archive master -o key-ncognito-$(shell git describe).zip
