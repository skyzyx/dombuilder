all:
	@cat Makefile | grep : | grep -v PHONY | grep -v @ | sed 's/:/ /' | awk '{print $$1}' | sort

#-------------------------------------------------------------------------------

.PHONY: install
install:
	npm install
	node_modules/.bin/bower install

.PHONY: lint
lint:
	node_modules/.bin/eslint dombuilder.js

.PHONY: build
build:
	node_modules/.bin/uglifyjs dombuilder.js --source-map dombuilder.js.map --screw-ie8 --compress --mangle > dombuilder.min.js

.PHONY: test
test:
	mkdir -p tests/dependencies
	cp bower_components/qunit/qunit/* tests/dependencies/
	cp bower_components/underscore/underscore-min.js tests/dependencies/
	@ echo "Open tests/test-runner.html in your web browser."

#-------------------------------------------------------------------------------

.PHONY: docs
docs:
	rm -Rf docs
	node_modules/.bin/docco -l parallel dombuilder.js
	mv docs/dombuilder.html docs/index.html

.PHONY: pushdocs
pushdocs: docs
	rm -Rf /tmp/gh-pages
	git clone git@github.com:skyzyx/dombuilder.git --branch gh-pages --single-branch /tmp/gh-pages
	cp -Rf ./docs/ /tmp/gh-pages/
	cd /tmp/gh-pages/ && git add . && git commit -a -m "Automated commit on $$(date)" && git push origin gh-pages

#-------------------------------------------------------------------------------

.PHONY: tag
tag:
	@ if [ $$(git status -s -uall | wc -l) != 0 ]; then echo 'ERROR: Git workspace must be clean.'; exit 1; fi;

	@echo "This release will be tagged as: $$(cat ./VERSION)"
	@echo "This version should match your gem. If it doesn't, re-run 'make gem'."
	@echo "---------------------------------------------------------------------"
	@read -p "Press any key to continue, or press Control+C to cancel. " x;

	keybase dir sign
	git add .
	git commit -a -m "Cryptographically signed the $$(cat ./VERSION) release."
	git tag $$(cat ./VERSION)

#-------------------------------------------------------------------------------

.PHONY: version
version:
	@echo "Current version: $$(cat ./VERSION)"
	@read -p "Enter new version number: " nv; \
	printf "$$nv" > ./VERSION

#-------------------------------------------------------------------------------

.PHONY: clean
clean:
	rm -Rf bower_components
	rm -Rf docs
	rm -Rf node_modules
