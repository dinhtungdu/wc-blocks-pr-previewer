// ==UserScript==
// @name         WooCommerce Blocks PR Previewer
// @namespace    http://tampermonkey.net/
// @version      0.1
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
					code: `<?php
						  include 'wordpress/wp-load.php';
						  delete_transient( '_wc_activation_redirect' );
						  ?>`,
				},
				{
					step: 'writeFile',
					path: `/wordpress/wp-content/plugins/woocommerce-gutenberg-products-block-${ prNumber }/blocks.ini`,
					data: `woocommerce_blocks_phase = 3
						  woocommerce_blocks_env = production`,
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
