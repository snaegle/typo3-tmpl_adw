.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../Includes.txt


.. _grundlagen_zugang:

1.2 Zugang
==============
1.2.1 Alles im Web-Browser
--------------------------
TYPO3 ist ein Online-Redaktionssystem und verwendet als Client nur einen üblichen Web-Browser. Sie können somit jederzeit von jedem Ort mit Internet-Zugang Veränderungen an Ihrer Webseite vornehmen.

1.2.2 Frontend
--------------
Das sogenannte Frontend von TYPO3 ("vordere Seite") ist die Webseite, die den Internetnutzern angezeigt wird, in unserem Fall die AdW-Webseite. Der Zugriff kann mit jedem beliebigen Web-Browser erfolgen, auch mit älteren Versionen und auch ohne spezielle Funktionen wie Cookies oder JavaScript. Im Allgemeinen ist auch kein Login notwendig (nur bei passwortgeschützten Webseiten). Der Zugriff auf die Webseiten erfolgt über die URL:

http://www.adw-goe.de

1.2.3 Backend
-------------
Das sogenannte Backend von TYPO3 („hintere Seite") ist das Content-Management-System, mit dem die Webseiten erstellt und editiert werden. Der Zugriff ist nur für berechtigte Personen, die sogenannten Web-Autoren oder -Redakteure möglich (Login, siehe Abschnitt 1.2.4). Sie brauchen dafür einen Benutzernamen und ein Passwort mit einer entsprechenden TYPO3-Berechtigung.
Der Zugriff kann mit allen gängigen neueren Web-Browsern erfolgen. Cookies und JavaScript müssen eingeschaltet sein und Popup-Fenster müssen für diesen Server erlaubt sein. Wir empfehlen die Verwendung des Browsers Firefox.
Browsereinstellungen für Firefox überprüfen und ggf. ändern:

- Pop-up-Fenster erlauben: über Extras auf Einstellungen gehen, dort im Ordner Inhalt
    - entweder das Häkchen bei Pop-up-Fenster blockieren entfernen
    - oder Häkchen setzen und unter Ausnahmen die URL der Webseite hinzufügen
- JavaScript ermöglichen: Häkchen bei JavaScript aktivieren
- Cookies ermöglichen: im Ordner Datenschutz: Firefox wird eine Chronik anlegen oder Firefox wird eine Chronik nach benutzerdefinierten Einstellungen anlegen (Häkchen bei Cookies akzeptieren setzen und Behalten bis Firefox geschlossen wird) auswählen

Der Zugriff auf das Backend erfolgt über die URL:

https://www.adw-goe.de/typo3

Die Endung /typo3 wird lediglich an die URL Ihrer Webseite angefügt. Sie müssen gegebenenfalls noch ein Sicherheitszertifikat herunterladen, um in das Backend der Webseite zu gelangen.

1.2.4 Login zum Editieren
-------------------------
Wenn Sie die Backend-Adresse in Ihrem Web-Browser eingeben, erscheint eine Seite mit folgendem Dialogfeld:

.. figure:: ../../Images/LogIn.png
	:width: 300px
	:alt: Login fürs Backend

Geben Sie bitte Benutzername und Passwort ein und klicken Sie Anmelden. Bei erfolgreichem Login erscheint Ihre persönliche Benutzeroberfläche (siehe Kapitel 1.4).
