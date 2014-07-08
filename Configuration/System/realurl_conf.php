<?php
$GLOBALS['TYPO3_CONF_VARS']['EXTCONF']['realurl'] = array(
	'_DEFAULT' => array(
		'init' => array(
			'enableCHashCache' => false,
			'appendMissingSlash' => 'ifNotFile,redirect',
			'adminJumpToBackend' => true,
			'enableUrlDecodeCache' => false,
			'enableUrlEncodeCache' => false,
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
					'tx-find-data' => 1369315139,
					'tx-find-turtle' => 1380124799,
					'tx-find-rdf' => 1378891468,
					'tx-find-csv' => 1378902868,
					'tx-find-bna' => 1378914906
				),
				'noMatch' => 'bypass'
			)
		),
		'postVarSets' => array(
			'_DEFAULT' => array(
				'person' => array(
					array(
						'GETvar' => 'tx_wtdirectory_pi1[show]',
						'lookUpTable' => array(
							'table' => 'tt_address',
							'id_field' => 'uid',
							'alias_field' => 'name',
							'addWhereClause' => ' AND NOT deleted',
							'useUniqueCache' => 1,
							'useUniqueCache_conf' => array(
								'strtolower' => 1,
								'spaceCharacter' => '-',
							),
						),
					),
				),
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
