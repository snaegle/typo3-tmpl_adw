<?php
$GLOBALS['TYPO3_CONF_VARS']['EXTCONF']['realurl'] = array(
		'dev.adw-goe.de' => array(
				'init' => array(
						'enableCHashCache' => true,
						'appendMissingSlash' => 'ifNotFile,redirect',
						'adminJumpToBackend' => true,
						'enableUrlDecodeCache' => true,
						'enableUrlEncodeCache' => true,
						'emptyUrlReturnValue' => '/'
				),
				'pagePath' => array(
						'type' => 'user',
						'userFunc' => 'EXT:realurl/class.tx_realurl_advanced.php:&tx_realurl_advanced->main',
						'spaceCharacter' => '-',
						'languageGetVar' => 'L',
						'rootpage_id' => '1'
				),
				'fileName' => array(
						'defaultToHTMLsuffixOnPrev' => 0,
						'acceptHTMLsuffix' => 1,
				),
				'preVars' => array(
						array(
								'GETvar' => 'L',
								'valueMap' => array(
										'en' => 1,
										'fr' => 2,
										'it' => 3,
										'es' => 4,
										'cz' => 5),
								'noMatch' => 'bypass'
						),
				),
				'postVarSets' => array(
						'_DEFAULT' => array(
								'a' => array(
										array(
												'GETvar' => 'tx_find_find[action]',
												'valueMap' => array(
														'data' => 'data',
														'suggest' => 'suggest',
												),
												'noMatch' => 'bypass',
										),
								),
								'c' => array(
										array(
												'GETvar' => 'tx_find_find[controller]',
												'noMatch' => 'bypass',
										),
								),
								'gsn' => array(
										array(
												'GETvar' => 'tx_find_find[id]',
										)
								),
						)
				)
		),
);
?>