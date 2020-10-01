# ChromeMcMasterExtension
This is a browser extension that allows for quick access to McMaster-Carr's online catalog with some fun features. This is a fan made project and is not affiliated with McMaster-Carr. 

Main Features:
- Random-view a random set of products in the McMaster catalog with the click of a button (This references an array of URLs pulled from one of McMaster's sitemap XML files with over 57,000 unique URLs for browsing their online catalog. While this doesn't get you the resolution that individual part numbers would, it's still a blast to see the vast scope of product offerings from McMaster this way.)
- Search-search for a product or part number directly in the extension
- CAD Download-enter a part number and automatically download the desired filetype, file names can be customized to be more useful than the default names
- Make Label-enter a part number and automatically generate a label for that part that you can print, with label formats for laser/inkjet and thermal printers
- Part Detail Table-copy an automatically formatted table with part detail information from a product page, for use with creating purchase orders and bill of material documents

I have always enjoyed browsing through the vast catalog of industrial supply products that McMaster-Carr offers. I wanted a way to see the full range of product offerings they have and thought that a "random" button of some kind would be fun. As I started developing the extension for that task I decided to start adding more functionality like the search bar and label maker. I am no coding expert so there are likely many improvements that can be made to the code for efficiency and such - feel free to contribute to the project! I'm just happy to be having fun with the learning process. 

## Wishful Thinking Improvements
- Have the array of item categories autoupdate according to the latest XML files available through McMaster's Sitemap files
- Save browsing history with each use of the random or search feature. Currently when tabs are updated with new URLs the browsing history is not saved so you can't even go back to a previously viewed product page
- Add an optional setting for the random feature to pick from a list of part numbers instead of referencing Sitemap URLs which are limited to larger part categories
- Create a feature to browse through products recently added to the catalog

## History
v3.0.0: Released September 30, 2020
- Added a Part Detail Table feature to allow users to quickly copy part information in a table format for insertion into purchase order forms or spreadsheets
- Added a CAD file renaming feature to allow users to download CAD files with more useful names with options for how to customize words and characters in file names
- Updated CAD Download feature to allow automatic downloading of CAD files for multiple parts from a comma-separated list of part numbers
- Updated Label Making feature to allow automatic label making for multiple parts from a comma-separated list of part numbers
- Added options to Label Making feature for selecting either photos or QR codes to be included on appropriately sized label formats

v2.0.1: Released August 30, 2020
- Small bug fixes

v2.0.0: Released August 29, 2020
- Updated interface to use HTML elements instead of image files for buttons
- Reduced filesize of URL reference list for random feature
- Added a CAD Download feature that accepts a part number input and automatically navigates to the part page and downloads the selected filetype from the dropdown menu
- Added a Label Making feature that accepts a part number input and automatically generates a PNG image file that can be printed as labels in various formats and sizes (that correspond with labels available through McMaster-Carr for purchase)
- Added a Settings feature to allow users to customize their experience with the extension so that default options can be set for dropdown selections and the extension popup window can be customized with what options to appear

v1.0.0: Released August 5, 2020