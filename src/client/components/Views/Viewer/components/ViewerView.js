import ViewerConfigurator from 'Viewer.Configurator'
import { history as browserHistory } from 'BrowserContext'
import './ViewerView.scss'
import React from 'react'
import queryString from 'query-string'
class ViewerView extends React.Component {
  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  constructor (props) {
    super(props)

    this.onModelRootLoaded = this.onModelRootLoaded.bind(this)
    this.onViewerCreated = this.onViewerCreated.bind(this)
    this.onError = this.onError.bind(this)
  }

  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  componentWillMount () {
    const { query } = this.props.location

    const embed = query.embed
      ? (query.embed.toLowerCase() === 'true')
      : false

    const navbarState = !embed
      ? { links: { settings: false } }
      : { visible: false }

    this.props.setNavbarState(navbarState)
  }

  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  onError (error) {
    if (error.responseJSON === 'Not Found') {
      browserHistory.push('/404')
    }
  }

  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  onViewerCreated (viewer, loader) {
    this.viewer = viewer
    this.loader = loader

    viewer.addEventListener(
      Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT,
      this.onModelRootLoaded)
  }

  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  onModelRootLoaded (e) {
    this.viewer.removeEventListener(
      Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT,
      this.onModelRootLoaded)

    this.viewer.loadDynamicExtension(
      'Viewing.Extension.ViewableSelector', {
        apiUrl: '/api/derivatives/2legged'
      })

    this.loader.show(false)
  }

  /// //////////////////////////////////////////////////////
  //
  //
  /// //////////////////////////////////////////////////////
  render () {
    const viewStyle = {
      height: !this.props.appState.navbar.visible
        ? 'calc(100vh)'
        : '100%'
    }

    const params = queryString.parse(this.props.location.search)

    return (
      <div className='viewer-view' style={viewStyle}>
        <ViewerConfigurator
          setNavbarState={this.props.setNavbarState}
          onViewerCreated={this.onViewerCreated}
          setViewerEnv={this.props.setViewerEnv}
          modelId={params.id}
          appState={this.props.appState}
          location={this.props.location}
          onError={this.onError}
          database='gallery'
          showLoader
        />
      </div>
    )
  }
}

export default ViewerView
