[![Build Status](https://travis-ci.org/ipf/typo3-tmpl_adw.svg?branch=master)](https://travis-ci.org/ipf/typo3-tmpl_adw)

# Requirements

* Installed system extension fe_login
        * TypoScript constant `plugin.tx_find.felogin.storagePid` has to be set in order to use the frontend user functionality.


# Development notes

To get a development environment for the otherwise server-side generated JavaScript and CSS file you need to run `./gradlew` in the root folder of the extensions.

For a production environment use the command `./gradlew -Penv=production`

## Please note

If you change scss files and commit them without running `./gradlew`, the css files won't get updated and - obviously - you can't expect to see changes in the frontend.

## Applying RealURL configuration shipped with this extension

To apply the shipped RealURL configuration the global configuration file has to be a symlink to the file in
Configuration/System/realurl_conf

In order to achieve this create the symlink in typo3conf with

`ln -s ext/tmpl_adw/Configuration/System/realurl_conf.php realurl_conf.php`
