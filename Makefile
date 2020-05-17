.PHONY: clean

build:
	./node_modules/.bin/tsc
	
clean:
	rm -rf ./dist
