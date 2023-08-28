// ==UserScript==
// @name         WooCommerce Blocks PR Previewer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://github.com/woocommerce/woocommerce-blocks/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

( function () {
	'use strict';
	const prNumber = document
		.querySelector( '.gh-header-title span' )
		.innerText.replace( '#', '' );
	if ( ! prNumber ) return;
	const headerActions = document.querySelector( '.gh-header-actions' );
	const previewButton = document.createElement( 'button' );
	previewButton.innerText = 'Preview';
	previewButton.className =
		'Button--secondary Button--small Button m-0 mr-md-0';
	previewButton.addEventListener( 'click', function () {
		const blueprint = {
			landingPage: '/wp-admin/',
			steps: [
				{
					step: 'login',
					username: 'admin',
					password: 'password',
				},
				{
					step: 'installPlugin',
					pluginZipFile: {
						resource: 'wordpress.org/plugins',
						slug: 'woocommerce',
					},
					options: {
						activate: true,
					},
				},
				{
					step: 'installPlugin',
					pluginZipFile: {
						resource: 'url',
						url: `https://wcblocks.wpcomstaging.com/wp-content/uploads/woocommerce-gutenberg-products-block-${ prNumber }.zip`,
					},
					options: {
						activate: true,
					},
				},
				{
					step: 'runPHP',
					code: `
					<?php
						include 'wordpress/wp-load.php';
						delete_transient( '_wc_activation_redirect' );
					?>
					`,
				},
				{
					step: 'writeFile',
					path: `/wordpress/wp-content/plugins/woocommerce-gutenberg-products-block-${ prNumber }/blocks.ini`,
					data: `
					woocommerce_blocks_phase = 3
					woocommerce_blocks_env = production
					`,
				},
				{
					step: 'runPHP',
					code: `
					<?php
						include 'wordpress/wp-load.php';
						wc_create_attribute( array(
							name' => 'Color',
							slug' => 'pa_color',
						) );
						wc_create_attribute( array(
							name' => 'Size',
							slug' => 'pa_size',
						) );
					?>
					`,
				},
				{
					step: 'runPHP',
					code: `
					<?php
						include 'wordpress/wp-load.php';
						$products_data = [
							[
								'title' => 'Product 1',
								'description' => 'Product 1 description',
								'price' => 10,
								'sale_price' => 5,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 2',
								'description' => 'Product 2 description',
								'price' => 20,
								'sale_price' => 10,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 3',
								'description' => 'Product 3 description',
								'price' => 30,
								'sale_price' => 25,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 4',
								'description' => 'Product 4 description',
								'price' => 40,
								'sale_price' => 24,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 5',
								'description' => 'Product 5 description',
								'price' => 50,
								'sale_price' => 35,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 6',
								'description' => 'Product 6 description',
								'price' => 60,
								'sale_price' => 40,
								'stock_status' => 'outofstock',
							],
							[
								'title' => 'Product 7',
								'description' => 'Product 7 description',
								'price' => 70,
								'sale_price' => 70,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 8',
								'description' => 'Product 8 description',
								'price' => 80,
								'sale_price' => 68,
								'stock_status' => 'instock',
							],
							[
								'title' => 'Product 9',
								'description' => 'Product 9 description',
								'price' => 90,
								'sale_price' => 85,
								'stock_status' => 'outofstock',
							],
							[
								'title' => 'Product 10',
								'description' => 'Product 10 description',
								'price' => 100,
								'sale_price' => 70,
								'stock_status' => 'instock',
							],
						];

						foreach ($products_data as $data) {
							$product = new WC_Product_Simple();
							$product->set_name($data['title']);
							$product->set_status('publish');
							$product->set_catalog_visibility('visible');
							$product->set_description($data['description']);
							$product->set_short_description($data['description']);
							$product->set_regular_price($data['price']);
							$product->set_sale_price($data['sale_price']);
							$product->set_stock_status($data['stock_status']);
							$product->save();
						}
					?>
					`,
				},
			],
		};
		const encoded = JSON.stringify( blueprint );
		window.open(
			'https://playground.wordpress.net/#' + encodeURI( encoded ),
			'_blank'
		);
	} );
	headerActions.prepend( previewButton );
} )();
