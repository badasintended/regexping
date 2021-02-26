const { React } = require("powercord/webpack");
const { ButtonItem, TextAreaInput } = require("powercord/components/settings");

module.exports = ({ getSetting, updateSetting }) => {
  return <div>
    <TextAreaInput
      className="regexPingRules"
      note="Rules are separated by new line. For simplicity, it doesn't support backslashes (\), use square bracket ([]) instead."
      onChange={v => updateSetting("rules", v)}
      rows={10}
      value={getSetting("rules", "")}
    >Ping Rules</TextAreaInput>
    <ButtonItem
      button="Reload Plugin"
      note="You need to reload the plugin after rule changes."
      onClick={() => powercord.pluginManager.remount("regexping")}
    >Reload Plugin</ButtonItem>
  </div>;
};
