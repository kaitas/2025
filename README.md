# 2025
akihiko.shirai.as/2025

https://qiita.com/cleantted/items/0eff40f48abd9eea3a6c


```vi ~/.zshrc
export PYTHON_HOME="/usr/bin/python3"
export PIP_HOME="/Users/aki/Library/Python/3.9/bin"
export PATH="$PYTHON_HOME:$PIP_HOME:$PATH"
# pythonコマンドでpython3が起動するように
alias python='python3'
alias pip='pip3'
```


```
pip install mkdocs
mkdocs new cleantted_action_test
mkdocs serve
```

https://squidfunk.github.io/mkdocs-material/publishing-your-site/