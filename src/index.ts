
import '@babel/polyfill';
import { components } from './components';

const REACTORY_CORE_PLUGIN = (props) => {

}

REACTORY_CORE_PLUGIN.install = function( api ){
  api.log("Installing Reactory Core Plugin");
  api.registerComponent('reactory-core', 'ReactoryCoreClientPlugin', '1.0.0', REACTORY_CORE_PLUGIN);
  
  components.forEach((component) => {
    api.log('Installing Component', { component }, 'debug');
    api.registerComponent(component.nameSpace, component.name, component.version, component.component, component.tags, component.roles, true);
  });
  // a comments
  api.amq.raiseReactoryPluginEvent('loaded', { componentFqn: 'reactory-core.ReactoryCoreClientPlugin@1.0.0', component: REACTORY_CORE_PLUGIN });
  api.log("Installing Reactory Core Plugin - Done");
};

if(window && window.reactory) {  
    REACTORY_CORE_PLUGIN.install(window.reactory.api);
};