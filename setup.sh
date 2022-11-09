#! /bin/sh
a=`pwd`
tree_sitter="/Users/suman/.local/share/nvim/site/pack/packer/start/nvim-treesitter/queries/ccl"
for i in `ls queries/`; do ln -s "${a}/queries/$i" "${tree_sitter}/$i" ; done
