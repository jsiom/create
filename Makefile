
serve: node_modules
	@node_modules/serve/bin/serve -Slojp 0

test: node_modules
	@node_modules/jsmd/bin/jsmd Readme.md \
		&& node test.js \
		&& echo 'It works!'

node_modules: package.json
	@packin install --meta $< --folder $@
	@ln -sfn .. $@/create

.PHONY: serve test
