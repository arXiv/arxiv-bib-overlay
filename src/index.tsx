import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { pageElementMain, pageElementSidebar } from './arxiv_page'
import { state } from './model/State'
import { BibMain } from './ui/BibMain'
import { Sidebar } from './ui/Sidebar'

function initialize() {
    state.init_from_cookies()

    ReactDOM.render(<BibMain state={state}/>, pageElementMain())
    ReactDOM.render(<Sidebar state={state}/>, pageElementSidebar())

    state.bibmodel.configureAvailableFromAbstract()
    if (!state.isdisabled) {
        state.bibmodel.loadFromAbtract()
    } 

    // @ts-ignore -- for debugging purposes
    document.bibex_present = true      
    // @ts-ignore -- for debugging purposes
    document.bibex_state = state    
}

// @ts-ignore -- for debugging purposes
if (document.bibex_present) {
    console.log('Bibex already present on page')  
} else {
    initialize()
}
