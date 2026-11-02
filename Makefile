install:
	mise install
	bundle install
	npm install

css:
	npx @tailwindcss/cli -i ./assets/css/base.css -o ./assets/css/compiled.css --watch

dev:
	bundle exec jekyll serve --livereload

draft:
	bundle exec jekyll serve --unpublished --livereload --future

clean:
	rm -rf _site/
	rm -f assets/css/compiled.css
	
check:
	bundle exec jekyll doctor
	bundle exec jekyll serve --livereload >/dev/null 2>&1 & \
	SERVER_PID=$$!; \
	sleep 3 && \
	bundle exec htmlproofer _site --no-enforce-https; \
	EXIT_CODE=$$?; \
	kill $$SERVER_PID 2>/dev/null || true; \
	sleep 1; \
	kill -9 $$SERVER_PID 2>/dev/null || true; \
	exit $$EXIT_CODE