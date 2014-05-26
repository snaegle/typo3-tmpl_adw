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
class SortEntriesByDateViewHelperTest extends \TYPO3\CMS\Fluid\Tests\Unit\ViewHelpers\ViewHelperBaseTestcase {

	/**
	 * @var \Subugoe\TmplAdw\ViewHelpers\SortEntriesByDateViewHelper
	 */
	protected $fixture;

	public function setUp() {
		parent::setUp();

		$this->fixture = new \Subugoe\TmplAdw\ViewHelpers\SortEntriesByDateViewHelper();
	}

	protected $testData = array(
			array(
					'id' => 1,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1513',
					'bis_verbal' => ''
			),
			array(
					'id' => 2,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1516',
					'bis_verbal' => ''
			),
			array(
					'id' => 3,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1516',
					'bis_verbal' => '1616'
			),
			array(
					'id' => 4,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '',
					'bis_verbal' => ''
			));

	protected $expectedData = array(
			array(
					'id' => 4,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '',
					'bis_verbal' => ''
			),
			array(
					'id' => 3,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1516',
					'bis_verbal' => '1616'
			),
			array(
					'id' => 2,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1516',
					'bis_verbal' => ''
			),
			array(
					'id' => 1,
					'name' => 'Franz Konrad von Stadion',
					'von_verbal' => '1513',
					'bis_verbal' => ''
			),
	);


	/**
	 * @test
	 */
	public function renderAddsObjectNameToTemplateVariableContainer() {
		$mockViewHelperNode = $this->getMock('TYPO3\\CMS\\Fluid\\Core\\Parser\\SyntaxTree\\ViewHelperNode', array('evaluateChildNodes'), array(), '', FALSE);
		$mockViewHelperNode->expects($this->once())->method('evaluateChildNodes')->will($this->returnValue('foo'));
		$this->templateVariableContainer->expects($this->at(0))->method('add')->with('as', $this->expectedData);
		$this->templateVariableContainer->expects($this->at(1))->method('remove')->with('as');

		$this->injectDependenciesIntoViewHelper($this->fixture);
		$this->fixture->setViewHelperNode($mockViewHelperNode);
		$this->fixture->render($this->testData, 'as');
	}

	/**
	 * @test
	 */
	public function sortingReturnsCorrectSorting() {
		$mockViewHelperNode = $this->getMock('TYPO3\\CMS\\Fluid\\Core\\Parser\\SyntaxTree\\ViewHelperNode', array('evaluateChildNodes'), array(), '', FALSE);

		$this->injectDependenciesIntoViewHelper($this->fixture);
		$this->fixture->setViewHelperNode($mockViewHelperNode);
		$this->templateVariableContainer->expects($this->at(0))->method('add')->with('as', $this->expectedData);
		$this->fixture->render($this->testData, 'as');

	}
}