# 综合性的一个插件

由于本人经常性的写一些文档，然后现有的很多插件版本各方面存在问题，甚至还有一些作者已经放弃维护了，所以决定自己写一个综合性的插件用来满足个人需求。

本插件只在 Windows 系统下进行测试，Linux 等其他环境不保证问题的存在！！！

本人环境【Windows 10 64bit，nodejs v8.11.3，gitbook 3】

## 前置条件

使用 `npm root -g`查看`npm`全局模块安装路径

新建`NODE_PATH`环境变量

将路径加入到`NODE_PATH`环境变量中。

全局安装相应模块

```bash
npm install -g gitbook
npm install -g gitbook-cli

npm install -g mermaid.cli
```

## 编辑 book.json:

```json
{
    "plugins": ["books"]
}
```

运行 `gitbook install`.

## 数学公式使用

支持 KaTeX 已支持的全部符号

[KaTeX 使用说明](https://khan.github.io/KaTeX/docs/supported.html)

```html
内联数学公式：$$\int_{-\infty}^\infty g(x) dx$$

$$\fcolorbox{red}{aqua}{A}$$

$$\textcolor{#228B22}{F=ma}$$

块级数学公式:

$$
\def\arraystretch{1.5}
\begin{array}{c|c:c}
   a & b & c \\ \hline
   d & e & f \\
   \hdashline
   g & h & i
\end{array}
$$
```
