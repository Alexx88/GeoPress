<?php

class GP_Format_PO {
	
	var $extension = 'po';
	
	function print_exported_file( $map, $locale, $translation_set, $entries ) {
		$po = new PO();
		// TODO: add more meta data in the map: language team, report URL
		// TODO: last updated for a translation set
		$po->set_header( 'PO-Revision-Date', gmdate( 'Y-m-d H:i:s+0000' ) );
		$po->set_header( 'MIME-Version', '1.0' );
		$po->set_header( 'Content-Type', 'text/plain; charset=UTF-8' );
		$po->set_header( 'Content-Transfer-Encoding', '8bit' );
		$po->set_header( 'Plural-Forms', "nplurals=$locale->nplurals; plural=$locale->plural_expression;" );
		$po->set_header( 'X-Generator', 'GeoPress/' . gp_get_option('version') );

		// force export only current translations
		$filters['status'] = 'current';

		foreach( $entries as $entry ) {
			$po->add_entry( $entry );
		}
		$po->set_header( 'Map-Id-Version', $map->name );

		// TODO: include parent map's names in the comment
		echo "# Translation of {$map->name} in {$locale->english_name}\n";
		echo "# This file is distributed under the same license as the {$map->name} package.\n";

		echo $po->export();
	}
	
	function read_translations_from_file( $file_name, $map = null ) {
		$po = new PO();
		$result = $po->import_from_file( $file_name );
		return $result? $po : $result;
	}
	
	function read_originals_from_file( $file_name ) {
		return $this->read_translations_from_file( $file_name );
	}

}

GP::$formats['po'] = new GP_Format_PO;