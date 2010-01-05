<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<script src="dombuilder.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript" charset="utf-8">
		var _ = DOMBuilder;
		</script>
		<title>DOMBuilder</title>

		<script type="text/javascript" charset="utf-8">
		function cleanJS(s) {
			return s.replace(/</g, '&lt;')
			        .replace(/\n\t\t\t/g, "\n")
			        .replace(/\t/g, "    ")
			        .replace(/^\n/, '');
		}
		</script>

		<style>
		body {
			font-size: 16px;
			line-height: 24px;
			background-color: #f6f5ea;
			color: #453d5a;
			font-family: Cambria, serif;
		}
		div.container {
			width: 720px;
			margin: 50px 0 50px 50px;
		}
		p {
			width: 550px;
		}
		a, a:visited {
			padding: 0 1px;
			text-decoration: underline;
			color: #453d5a;
		}
		a:active, a:hover {
			text-decoration: none;
			color: #fff;
			background: #333;
		}
		h1, p, h3, h4, h5, h6 {
			margin-top: 40px;
		}
		p {
			margin-top: 20px;
			border-top: 1px dotted #999;
			padding-top: 30px;
		}
		b.header {
			font-size: 18px;
		}
		table, tr, td {
			margin: 0; padding: 0;
		}
		td {
			padding: 2px 12px 2px 0;
		}
		code, pre, tt {
			font-family: Monaco, Consolas, monospace;
			font-size: 12px;
			line-height: 18px;
			color: #555529;
		}
		code {
			margin-left: 20px;
		}
		pre {
			font-size: 12px;
			padding: 2px 0 2px 12px;
			border-left: 6px solid #aaaa99;
			margin: 0px 0 30px;
		}
		</style>
	</head>

	<body>
		<div class="container">
			<h1>Performance tests</h1>
			<p>See the <a href="http://ryanparman.com/labs/dombuilder/">demo</a>, read the <a href="http://skyzyx.github.com/dombuilder/">documentation</a>, <a href="http://github.com/skyzyx/dombuilder/">view the source</a>, or <a href="http://ryanparman.com/labs/dombuilder/performance.php">compare performance</a>.</p>
			<p>Comparing performance for multiple approaches to adding DOM nodes. The runtime of each test is from looping 400 times. Results are in milliseconds.</p>

			<p><strong>What are we testing?:</strong></p>
			<pre><code id="browser"></code></pre>
			<script type="text/javascript" charset="utf-8">
			document.getElementById('browser').innerHTML = navigator.userAgent;
			</script>

			<table id="results_innerhtml" border="1" cellpadding="3" width="100%"></table><br>
			<table id="results_rawdom" border="1" cellpadding="3" width="100%"></table><br>
			<table id="results_dombuilder" border="1" cellpadding="3" width="100%"></table><br>

			<!-- Test area -->
			<div id="hook"></div>
			<script type="text/javascript" charset="utf-8" id="script1">
			var node = document.getElementById('hook'),
				insertString = '<div class="a"><div class="b"><div class="c"><div class="d"><div class="e">ZZZ</div></div></div></div></div>',
				i, max;
			</script>

			<?php include './performance_includes/innerhtml.htm'; ?>
			<?php include './performance_includes/rawdom.htm'; ?>
			<?php include './performance_includes/dombuilder.htm'; ?>

			<script type="text/javascript" charset="utf-8">
			node.innerHTML = '';
			</script>

		</div>
	</body>
</html>
