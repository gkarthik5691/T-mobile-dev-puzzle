Are there any problems or code smells in the app?
    (1) Failing test cases in reading-list reducer. [Fixed]
    (2) Missing Type Notation on reading-list components "item" being of Type : <any>. Fixed by changing type to "ReadingListItem". [Fixed]
    (3) Using constants in place of hard coded values in book-search.component.ts and reading-list.component.ts files. [Fixed].
    
Improvements:
    (1) Pipes can be implemented to avoid memory leaks. [Fixed]
    (2) Increase test coverage. Included missing test cases for book-search and reading-list components. [Fixed]
    (3) Currently only 10 books are listed per search, this can be improved to list all books.
    (4) Impose constraints by using tags in nx.json

Manual Accessibility Issues:
    (1) Missing alt attributes on Img elements. [Fixed]
    (2) Added tabIndex and aria-label to books search and reading list. [Fixed]
    
Light-House Accessibility Issues:
    (1) Search button do not have an accessible name. [Fixed]
    (2) Background and foreground colors do not have a sufficient contrast ratio. [Fixed]
