import { observer } from 'mobx-react'
import * as React from 'react'
import '../App.css'
import * as CONFIG from '../bib_config'
import { State } from '../model/State'
import { Outbound, OutboundCite, OutboundScholar } from './Outbound'

@observer
export class Sidebar extends React.Component<{state: State}, {}> {
    public render() {
        const state = this.props.state
        const bib = this.props.state.bibmodel

        if (state.isdisabled) {
            return OutboundScholar()
        }

        if (!bib || !bib.paper || !bib.paper.authors) {
            return OutboundScholar()
        }

        if (bib.currentDS && !bib.currentDS.loaded) {
            return OutboundScholar()
        }

        const auth_elements = bib.paper.authors.map(
            au => <li key={au.url}><a href={au.url} target='_blank' rel='noopener'>{au.name}</a></li>
        )

        let paper_title = bib.paper.title
        if (paper_title.length > 23) {
            paper_title = paper_title.substring(0, 20) + '...'
        }

        let auth_list = auth_elements
        if (auth_list.length > CONFIG.MAX_AUTHORS) {
            auth_list = auth_list.slice(0, CONFIG.MAX_AUTHORS)
            auth_list.push(
                <li key={bib.paper.url}><a href={bib.paper.url} target='_blank'  rel='noopener'>...</a></li>
            )
        }

        return (
            <div className='bib-sidebar-paper' >
              <div className='bib-sidebar-title'>
                <span><a href={bib.paper.url} target='_blank' rel='noopener'>{paper_title}</a></span>
              </div>
              <ul className='bib-sidebar-authors'>{auth_list}</ul>
              <Outbound paper={bib.paper}/>
              <OutboundCite paper={bib.paper}/>
              <div>
                <span>{CONFIG.POLICY_PROJECT_SHORTNAME}: </span>
                <span className='bib-selected'>{bib.currentDS.longname}</span>
              </div>
            </div>
        )
    }
}
