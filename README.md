# Tests for WD201 assignments

This repository contains test files that help confirm that student submissions on WD201 work as expected.

## Possible issues

### `require': cannot load such file -- rexml/document

Rails on Ruby 3 will require a gem `rexml` to be added to the `Gemfile`. Add the following line to the `:test` group:

```ruby
group :test do
  # ...
  gem 'rexml', '~> 3.2', '>= 3.2.5'
end
```
