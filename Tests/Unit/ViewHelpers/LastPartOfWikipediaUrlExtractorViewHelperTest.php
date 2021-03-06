<?php
namespace Subugoe\TmplAdw\Tests\Unit\ViewHelpers;

/* * *************************************************************
 *  Copyright notice
 *
 *  (c) 2014 Ingo Pfennigstorf <pfennigstorf@sub-goettingen.de>
 *      Goettingen State Library
 *  
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 * ************************************************************* */

/**
 * Description 
 */
class LastPartOfWikipediaUrlExtractorViewHelperTest extends \TYPO3\CMS\Fluid\Tests\Unit\ViewHelpers\ViewHelperBaseTestcase {

	/**
	 * @var \Subugoe\TmplAdw\ViewHelpers\LastPartOfWikipediaUrlExtractorViewHelper
	 */
	protected $fixture;

	public function setUp() {
		$this->fixture = new \Subugoe\TmplAdw\ViewHelpers\LastPartOfWikipediaUrlExtractorViewHelper();
	}

	/**
	 * @test
	 */
	public function isWikipediaPrefixCorrectlyRemoved() {
		$actual = $this->fixture->render('http://de.wikipedia.org/wiki/Domstift_Augsburg');
		$expected = 'Domstift_Augsburg';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function isInternationalWikipediaPrefixCorrectlyRemover() {
		$actual = $this->fixture->render('http://in.wikipedia.org/wiki/Taj_Mahal');
		$expected = 'Taj_Mahal';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function areHtmlCharsDecodedWhenCorrectlyEncoded() {
		$actual = $this->fixture->render('http://in.wikipedia.org/wiki/Taj_Mahal_(Indien)');
		$expected = 'Taj_Mahal_(Indien)';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function areEndodedHtmlCharsCorrectlyDecoded() {
		$url = 'http://de.wikipedia.org/wiki/Di%C3%B6zese_Augsburg';
		$actual = $this->fixture->render($url);
		$expected = 'Diözese_Augsburg';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function areUrlsWithParenthesesCorrectlyDecoded() {
		$url = 'http://de.wikipedia.org/wiki/Kollegiatstift_St._Paul_%28Freising%29';
		$actual = $this->fixture->render($url);
		$expected = 'Kollegiatstift_St._Paul_(Freising)';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function areHttpsUrlsCorrectlyStripped() {
		$url = 'https://de.wikipedia.org/wiki/Kollegiatstift_St._Paul';
		$actual = $this->fixture->render($url);
		$expected = 'Kollegiatstift_St._Paul';

		$this->assertSame($expected, $actual);
	}

	/**
	 * @test
	 */
	public function areUrlsWithMixedEntitiesCorrectlyParsed() {
		$url = 'http://de.wikipedia.org/wiki/St._Severus_(Gem%C3%BCnden)';
		$actual = $this->fixture->render($url);
		$expected = 'St._Severus_(Gemünden)';

		$this->assertSame($expected, $actual);
	}

}