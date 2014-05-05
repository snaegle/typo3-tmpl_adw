<?php
$GLOBALS['TYPO3_CONF_VARS']['EXTCONF']['realurl'] = array(
		'_DEFAULT' => array(
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
						0 => array(
								'GETvar' => 'L',
								'valueMap' => array(
										'en' => 1,
										'fr' => 2,
										'it' => 3,
										'es' => 4,
										'cz' => 5),
								'noMatch' => 'bypass'
						),
						1 => array(
								'GETvar' => 'type',
								'valueMap' => array(
										'rss-deutsche_inschriften_des_mittelalters' => 101,
										'rss-germania_sacra' => 104,
										'rss-residenzstaedte_im_alten_reich_1300_1800' => 107,
										'rss-edfu' => 109,
										'rss-septuaginta' => 110,
										'tx-find-data' => 1369315139
								),
								'noMatch' => 'bypass'
						)
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
