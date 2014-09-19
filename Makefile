PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
browserify := node_modules/.bin/browserify
watchify := node_modules/.bin/watchify

SRC 		:= $(wildcard ruffle/*.js)
TEST_ENTRY	:= test/index.test.js
TEST_BUNDLE := test/bundle.test.js
TEST_HTML 	:= test/test.html

.PHONY: all watch clean install test watch-test

all: install test

install: package.json
	npm install

test: $(SRC) $(TEST_BUNDLE)
	@open $(TEST_HTML)

watch-test: $(SRC) $(TEST_BUNDLE) test
	watchify $(TEST_ENTRY) $(TRANSFORMS) -o $(TEST_BUNDLE) -vd

$(TEST_BUNDLE): install $(shell browserify $(TRANSFORMS) --list $(TEST_ENTRY))
	mkdir -p $(dir $@)
	browserify $(TRANSFORMS) $(TEST_ENTRY) > $@
