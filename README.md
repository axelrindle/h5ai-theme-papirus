# h5ai-theme-papirus

An icon theme for [h5ai](https://github.com/lrsjng/h5ai) providing icons from the [Papirus Icon Theme](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme).

## Installation

1. Clone this repository somewhere

```shell
$ git clone --recurse-submodules https://github.com/axelrindle/h5ai-theme-papirus.git
$ cd h5ai-theme-papirus
```

2. Install dependencies

```shell
$ npm install
```

3. Run the installer

```shell
$ ./cli.js /var/www/html/_h5ai
```

If that does not work, try the following:

```shell
$ node cli.js /var/www/html/_h5ai
```

Replace `/var/www/html/_h5ai` with the absolute path to your `h5ai` installation.

## License

While this project is [MIT](LICENSE) licensed, I'm neither the author of `h5ai` nor `Papirus`, the copyright goes to their respective authors:

- [h5ai](https://github.com/lrsjng/h5ai/#license)

- [Papirus License](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/blob/master/LICENSE) and [Papirus Authors](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme/blob/master/AUTHORS)
