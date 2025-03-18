<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Mapa witryny XML - Edjzeck Smulders Portfolio</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 20px 0;
                    }
                    th {
                        background-color: #4a90e2;
                        color: white;
                        padding: 12px;
                        text-align: left;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #ddd;
                    }
                    tr:hover {
                        background-color: #f5f5f5;
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 30px;
                    }
                    .url {
                        color: #4a90e2;
                        text-decoration: none;
                    }
                    .url:hover {
                        text-decoration: underline;
                    }
                    .count {
                        background-color: #4a90e2;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 15px;
                        font-size: 0.8em;
                    }
                </style>
            </head>
            <body>
                <h1>Mapa witryny XML - Edjzeck Smulders Portfolio</h1>
                <p>
                    Ta mapa witryny zawiera <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URL(i).
                </p>
                <table>
                    <tr>
                        <th>URL</th>
                        <th>Ostatnia modyfikacja</th>
                        <th>Częstotliwość zmian</th>
                        <th>Priorytet</th>
                        <th>Obrazy</th>
                    </tr>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <tr>
                            <td>
                                <a class="url" href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                            </td>
                            <td><xsl:value-of select="sitemap:lastmod"/></td>
                            <td><xsl:value-of select="sitemap:changefreq"/></td>
                            <td><xsl:value-of select="sitemap:priority"/></td>
                            <td>
                                <span class="count">
                                    <xsl:value-of select="count(image:image)"/>
                                </span>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet> 