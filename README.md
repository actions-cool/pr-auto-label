# PR Auto Label

![](https://img.shields.io/github/workflow/status/actions-cool/pr-auto-label/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-pr--auto--label-blueviolet?style=flat-square)](https://github.com/marketplace/actions/pr-auto-label)
[![](https://img.shields.io/github/v/release/actions-cool/pr-auto-label?style=flat-square&color=orange)](https://github.com/actions-cool/pr-auto-label/releases)

PR auto set label follow its title.

## 🚀 How to use?

```yml
name: PR Auto Label

on:
  pull_request_target:
    types: [opened, edited]

jobs:
  set-labels:
    runs-on: ubuntu-latest
    steps:
      - name: pr-auto-label
        uses: actions-cool/pr-auto-label@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          enum: 'fix, feat, docs'
          format: 'pr-${type}'
          extra: 'feat/feature, docs/doc'
```

### Inputs

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub token | string | ✖ |
| enum | Only deal with these types, when no input will deal all | string | ✖ |
| format | PR label format. Default `pr(${type})` | string | ✖ |
| extra | Extra replacement | string | ✖ |

- `${type}` will replace the real PR title type.
- `pr-${type}-${type}` is not support.

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/pr-auto-label/issues)
- Submit [Pull Request](https://github.com/actions-cool/pr-auto-label/pulls) to improve the code of `pr-auto-label`

也欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
